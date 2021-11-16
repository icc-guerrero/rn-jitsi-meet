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
  s.default_subspec = 'Jitsi'
  s.dependency          'React'
  s.libraries           = 'c', 'sqlite3', 'stdc++'
  s.framework           = 'AudioToolbox','AVFoundation', 'CoreAudio', 'CoreGraphics', 'CoreVideo', 'GLKit', 'VideoToolbox'
  s.ios.vendored_frameworks = 'ios/WebRTC.framework'
  s.xcconfig            = { 'OTHER_LDFLAGS' => '-framework WebRTC' }

  s.subspec 'Jitsi' do |ss|
    ss.source_files = 'ios/React-Jitsi/**/*.{h,m,swift}'
    ss.dependency 'React-Jitsi/WebRTC'
  end


  s.subspec 'WebRTC' do |ss|
    ss.source_files = 'ios/WebRTC/**/*.{h,m,swift}'
  end

end
