require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'React-Jitsi'
  s.version      = package['version']
  s.summary      = 'React Native Jitsi module'
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = 'Homepage'
  s.platform     = :ios, "10.0"

  s.source       = { :git => "", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,swift}"

  s.libraries           = 'c', 'sqlite3', 'stdc++'
  s.framework           = 'AudioToolbox','AVFoundation', 'CoreAudio', 'CoreGraphics', 'CoreVideo', 'GLKit', 'VideoToolbox'
  s.ios.vendored_frameworks = 'ios/WebRTC.framework'
  s.xcconfig            = { 'OTHER_LDFLAGS' => '-framework WebRTC' }
  s.dependency          'React'
end



